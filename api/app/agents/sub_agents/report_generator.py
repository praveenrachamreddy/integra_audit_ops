# Placeholder for ReportGeneratorAgent
# In our current design, this is a utility class, not an LLM agent.
# It will contain methods for creating PDF and Markdown reports.

import os
from typing import List, Dict, Any, Optional
from tempfile import TemporaryDirectory
from app.services.pdf_tools import generate_pdf_report

class ReportGeneratorAgent:
    """
    A utility class responsible for generating reports in various formats
    from the final, structured audit data. This is not an LLM agent.
    """

    def create_pdf_report(self, score: Optional[int], issues: List[Dict[str, Any]], sections: List[Dict[str, Any]], output_dir: str) -> str:
        """
        Generates a PDF report and returns the file path.
        """
        return generate_pdf_report(sections, score, issues, output_dir=output_dir)

    def create_markdown_report(self, score: Optional[int], issues: List[Dict[str, Any]], sections: List[Dict[str, Any]]) -> str:
        """
        Generates a Markdown report and returns it as a string.
        """
        markdown = f"# Audit Report\n\n"
        markdown += f"**Overall Compliance Score:** {score}/100\n\n"
        
        markdown += "## Summary of Findings\n\n"
        for section in sections:
            flag = "✅" if not section.get('flagged') else "❌"
            markdown += f"### {flag} {section.get('title', 'Untitled Section')}\n"
            markdown += f"{section.get('content', '')}\n\n"
            
        markdown += "## Detailed Issues and Recommendations\n\n"
        if not issues:
            markdown += "No significant issues were identified.\n"
        else:
            for issue in issues:
                markdown += f"### Severity: {issue.get('severity', 'N/A')}\n"
                markdown += f"**Description:** {issue.get('description', '')}\n\n"
                markdown += f"**Recommendation:** {issue.get('recommendation', '')}\n\n"
                markdown += "---\n"
                
        return markdown
