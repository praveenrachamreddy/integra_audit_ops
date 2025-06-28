import os
from typing import List, Optional, AsyncGenerator
from PyPDF2 import PdfReader
from io import BytesIO
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from tempfile import NamedTemporaryFile
from motor.motor_asyncio import AsyncIOMotorDatabase
from motor.motor_asyncio import AsyncIOMotorGridFSBucket
from bson import ObjectId

async def extract_pdf_content(db: AsyncIOMotorDatabase, file_id: str) -> str:
    """
    Extracts all text content from a PDF file stored in GridFS.
    """
    try:
        fs = AsyncIOMotorGridFSBucket(db)
        grid_out = await fs.open_download_stream(ObjectId(file_id))
        
        # Read stream into an in-memory buffer for PyPDF2
        pdf_bytes = await grid_out.read()
        pdf_buffer = BytesIO(pdf_bytes)
        
        reader = PdfReader(pdf_buffer)
        text = ""
        for page in reader.pages:
            text += page.extract_text() or ""
        return text
    except Exception as e:
        # Log the exception properly in a real app
        return f"Error extracting PDF content for file_id {file_id}: {e}"

def generate_pdf_report(
    sections: Optional[List[dict]],
    score: Optional[int],
    issues: Optional[List[str]],
    output_dir: Optional[str] = None
) -> str:
    """
    Generates a PDF report from audit sections, score, and issues.
    Returns the file path to the generated PDF.
    """
    if output_dir is None:
        output_dir = os.getcwd()
    with NamedTemporaryFile(delete=False, suffix=".pdf", dir=output_dir) as tmpfile:
        c = canvas.Canvas(tmpfile.name, pagesize=letter)
        width, height = letter
        y = height - 40
        c.setFont("Helvetica-Bold", 16)
        c.drawString(40, y, "Audit Report")
        y -= 30
        if score is not None:
            c.setFont("Helvetica", 12)
            c.drawString(40, y, f"Audit Score: {score}")
            y -= 20
        if issues:
            c.setFont("Helvetica-Bold", 12)
            c.drawString(40, y, "Flagged Issues:")
            y -= 20
            c.setFont("Helvetica", 12)
            for issue in issues:
                c.drawString(60, y, f"- {issue}")
                y -= 15
        if sections:
            c.setFont("Helvetica-Bold", 12)
            c.drawString(40, y, "Report Sections:")
            y -= 20
            c.setFont("Helvetica", 12)
            for section in sections:
                flagged = section.get("flagged", False)
                title = section.get("title", "Section")
                content = section.get("content", "")
                c.setFont("Helvetica-Bold", 12)
                c.drawString(60, y, f"{'❌' if flagged else '✅'} {title}")
                y -= 15
                c.setFont("Helvetica", 12)
                for line in content.splitlines():
                    c.drawString(80, y, line)
                    y -= 12
                y -= 8
                if y < 60:
                    c.showPage()
                    y = height - 40
        c.save()
        return tmpfile.name 

async def save_pdf_stream_to_db(db: AsyncIOMotorDatabase, file_stream: AsyncGenerator, filename: str, metadata: Optional[dict] = None) -> str:
    """
    Saves a file stream to MongoDB GridFS. Returns the file id as a string.
    """
    fs = AsyncIOMotorGridFSBucket(db)
    file_id = await fs.upload_from_stream(filename, file_stream, metadata=metadata)
    return str(file_id)

async def get_pdf_from_db(db: AsyncIOMotorDatabase, file_id: str) -> bytes:
    """
    Retrieve a PDF file from MongoDB GridFS by file id. Returns the file bytes.
    """
    fs = AsyncIOMotorGridFSBucket(db)
    stream = await fs.open_download_stream(ObjectId(file_id))
    data = await stream.read()
    await stream.close()
    return data 