#!/usr/bin/env python3
"""
Test script to verify Gemini API integration
"""

import sys
import os

# Add the api directory to the path so we can import the service
sys.path.append(os.path.join(os.path.dirname(__file__), 'api'))

from app.services.adk import ADKClient
from app.core.config import settings
import asyncio

async def test_gemini_integration():
    """Test Gemini API integration"""
    print("Testing Gemini API integration...")
    
    # Check if GEMINI_API_KEY is set
    if not settings.GEMINI_API_KEY:
        print("❌ GEMINI_API_KEY is not set in the environment")
        return False
    
    # Check if we're configured to use Gemini directly
    if settings.GOOGLE_GENAI_USE_VERTEX:
        print("ℹ️  Configured to use Vertex AI, not direct Gemini API")
        print("   Set GOOGLE_GENAI_USE_VERTEX=false to use direct Gemini API")
        return True
    
    # Create ADK client
    adk_client = ADKClient()
    
    # Check if Gemini model is configured
    if not adk_client.gemini_model:
        print("❌ Failed to configure Gemini model")
        return False
    
    # Test a simple prompt
    try:
        test_data = {
            "prompt": "What is the capital of France?"
        }
        
        result = await adk_client.run_agent(
            agent_name="test_gemini",
            data=test_data,
            user_id="test_user",
            session_id="test_session",
            instruction="You are a helpful assistant that answers questions concisely."
        )
        
        if result and "result" in result:
            print("✅ Gemini API integration successful!")
            print(f"Response: {result['result']}")
            return True
        else:
            print("❌ No result returned from Gemini API")
            return False
            
    except Exception as e:
        print(f"❌ Error testing Gemini API: {str(e)}")
        return False

if __name__ == "__main__":
    # Run the test
    success = asyncio.run(test_gemini_integration())
    
    if success:
        print("\n🎉 Gemini integration test completed successfully!")
        sys.exit(0)
    else:
        print("\n💥 Gemini integration test failed!")
        sys.exit(1)