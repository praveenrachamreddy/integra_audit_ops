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
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.colors import HexColor

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
    issues: Optional[List[dict]],
    overall_severity: str,
    output_dir: Optional[str] = None
) -> str:
    """
    Generates a professional, multi-page PDF report from audit data using ReportLab Platypus.
    Handles text wrapping, page breaks, and styling automatically.
    Returns the file path to the generated PDF.
    """
    if output_dir is None:
        output_dir = os.getcwd()

    with NamedTemporaryFile(delete=False, suffix=".pdf", dir=output_dir) as tmpfile:
        doc = SimpleDocTemplate(tmpfile.name, pagesize=letter)
        story = []
        styles = getSampleStyleSheet()

        # --- Modify existing styles ---
        styles['Title'].fontName = 'Helvetica-Bold'
        styles['Title'].fontSize = 24
        styles['Title'].leading = 28
        styles['Title'].spaceAfter = 20
        styles['Title'].alignment = TA_CENTER
        styles['Title'].textColor = HexColor('#1E293B')

        styles['h2'].fontName = 'Helvetica-Bold'
        styles['h2'].fontSize = 16
        styles['h2'].leading = 20
        styles['h2'].spaceBefore = 10
        styles['h2'].spaceAfter = 10
        styles['h2'].textColor = HexColor('#334155')
        
        styles['h3'].fontName = 'Helvetica-Bold'
        styles['h3'].fontSize = 14
        styles['h3'].leading = 18
        styles['h3'].spaceBefore = 8
        styles['h3'].spaceAfter = 8
        styles['h3'].textColor = HexColor('#475569')

        styles['BodyText'].fontName = 'Helvetica'
        styles['BodyText'].fontSize = 11
        styles['BodyText'].leading = 14
        styles['BodyText'].spaceAfter = 12

        # --- Modify the 'Code' style which also exists by default ---
        styles.add(ParagraphStyle(
            name='CodeBlock',
            parent=styles['BodyText'],
            fontName='Courier',
            fontSize=10,
            leading=12,
            leftIndent=20,
            rightIndent=20,
            spaceBefore=6,
            spaceAfter=12,
            textColor=HexColor('#334155'),
            backColor=HexColor('#F1F5F9'),
            borderPadding=5,
        ))

        # --- Define Score Color based on Severity ---
        severity_colors = {
            "High": HexColor('#EF4444'),    # Red-500
            "Medium": HexColor('#F97316'), # Orange-500
            "Low": HexColor('#EAB308'),     # Yellow-500
            "None": HexColor('#22C55E'),    # Green-500
        }
        score_color = severity_colors.get(overall_severity, HexColor('#64748B')) # Default to Slate-500
        
        styles.add(ParagraphStyle(
            name='Score',
            parent=styles['h2'],
            alignment=TA_CENTER,
            textColor=score_color
        ))

        # --- Build the story ---
        story.append(Paragraph("Compliance Audit Report", styles['Title']))

        if score is not None:
            story.append(Paragraph(f"Overall Compliance Score: {score} / 100", styles['Score']))

        story.append(Spacer(1, 24))
        story.append(Paragraph("Summary of Findings", styles['h2']))
        
        if not sections:
            story.append(Paragraph("No sections were provided for this report.", styles['BodyText']))
        else:
            for section in sections:
                flag = "✅" if not section.get('flagged') else "❌"
                title = f"{flag} {section.get('title', 'Untitled Section')}"
                story.append(Paragraph(title, styles['h3']))
                
                content_text = section.get('content', '').replace('\n', '<br/>')
                story.append(Paragraph(content_text, styles['BodyText']))
                story.append(Spacer(1, 12))

        story.append(PageBreak())
        story.append(Paragraph("Detailed Issues & Recommendations", styles['h2']))

        if not issues:
            story.append(Paragraph("No compliance issues were identified during this audit.", styles['BodyText']))
        else:
            for issue in issues:
                issue_title = f"Issue: {issue.get('description', 'N/A')}"
                severity = f"Severity: {issue.get('severity', 'N/A')}"
                recommendation = issue.get('recommendation', 'No recommendation provided.')

                story.append(Paragraph(issue_title, styles['h3']))
                story.append(Paragraph(severity, styles['BodyText']))
                story.append(Paragraph("Recommendation:", styles['h3']))
                story.append(Paragraph(recommendation.replace('\n', '<br/>'), styles['CodeBlock']))
                story.append(Spacer(1, 24))
        
        doc.build(story)
        return tmpfile.name

async def save_pdf_stream_to_db(db: AsyncIOMotorDatabase, file_stream: AsyncGenerator, filename: str, metadata: Optional[dict] = None) -> str:
    """
    Saves a file stream to MongoDB GridFS. Returns the file id as a string.
    """
    fs = AsyncIOMotorGridFSBucket(db)
    file_id = await fs.upload_from_stream(filename, file_stream, metadata=metadata)
    return str(file_id)

async def save_pdf_file_to_db(db: AsyncIOMotorDatabase, file_path: str, filename: str, metadata: Optional[dict] = None) -> str:
    """
    Saves a local file to MongoDB GridFS. Returns the file id as a string.
    """
    fs = AsyncIOMotorGridFSBucket(db)
    with open(file_path, "rb") as f:
        file_id = await fs.upload_from_stream(filename, f, metadata=metadata)
    return str(file_id)

async def get_pdf_from_db(db: AsyncIOMotorDatabase, file_id: str) -> bytes:
    """
    Retrieve a PDF file from MongoDB GridFS by file id. Returns the file bytes.
    """
    fs = AsyncIOMotorGridFSBucket(db)
    stream = await fs.open_download_stream(ObjectId(file_id))
    data = await stream.read()
    stream.close()
    return data 