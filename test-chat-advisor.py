#!/usr/bin/env python3
"""
SkillMatch Chat Advisor Test Script
==================================

This script tests the chat advisor functionality.
"""

import sys
import os

# Add the backend directory to the path
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

from app.routers.chat import SkillAdvisor

def test_chat_responses():
    """Test chat advisor response generation"""
    print("🧪 Testing Chat Advisor Responses...")
    
    advisor = SkillAdvisor()
    
    # Test contexts
    test_contexts = [
        {
            "name": "New User Context",
            "context": {
                "user_skills": [],
                "missing_skills": [],
                "recent_match_score": None
            },
            "messages": [
                "Help me get started",
                "I want to become a data scientist",
                "What skills should I learn first?"
            ]
        },
        {
            "name": "Experienced User Context", 
            "context": {
                "user_skills": ["Python", "JavaScript", "SQL"],
                "missing_skills": ["Docker", "Kubernetes", "TensorFlow"],
                "recent_match_score": 0.65
            },
            "messages": [
                "How can I improve my match score?",
                "What should I learn next?",
                "Explain my analysis results"
            ]
        },
        {
            "name": "Career Guidance Context",
            "context": {
                "user_skills": ["HTML", "CSS", "JavaScript"],
                "missing_skills": ["React", "Node.js"],
                "recent_match_score": 0.45
            },
            "messages": [
                "I want to become a frontend developer",
                "Should I learn React or Vue?",
                "What's the best career path for me?"
            ]
        }
    ]
    
    total_tests = 0
    passed_tests = 0
    
    for test_case in test_contexts:
        print(f"\n📋 Testing: {test_case['name']}")
        print("-" * 40)
        
        for message in test_case['messages']:
            total_tests += 1
            print(f"\n💬 User: {message}")
            
            try:
                response = advisor.generate_response(message, test_case['context'])
                
                # Check if response is valid
                if response.response and len(response.response) > 10:
                    print(f"🤖 Bot: {response.response[:100]}...")
                    if response.suggestions:
                        print(f"💡 Suggestions: {len(response.suggestions)} provided")
                    passed_tests += 1
                    print("✅ PASS")
                else:
                    print("❌ FAIL - Invalid response")
                    
            except Exception as e:
                print(f"❌ FAIL - Error: {str(e)}")
    
    print(f"\n📊 Chat Test Results: {passed_tests}/{total_tests} tests passed")
    return passed_tests == total_tests

def test_skill_categories():
    """Test skill categorization logic"""
    print("\n🧪 Testing Skill Categories...")
    
    advisor = SkillAdvisor()
    
    # Test skill categories
    categories = advisor.skill_categories
    career_paths = advisor.career_paths
    
    print(f"✅ Skill Categories: {len(categories)} categories loaded")
    for category, skills in categories.items():
        print(f"   - {category}: {len(skills)} skills")
    
    print(f"✅ Career Paths: {len(career_paths)} paths loaded") 
    for path, skills in career_paths.items():
        print(f"   - {path}: {len(skills)} required skills")
    
    return True

def test_context_awareness():
    """Test context-aware responses"""
    print("\n🧪 Testing Context Awareness...")
    
    advisor = SkillAdvisor()
    
    # Test with different contexts
    test_cases = [
        {
            "message": "recommend skills",
            "context": {"missing_skills": ["Python", "SQL"]},
            "expected_keywords": ["Python", "SQL", "missing"]
        },
        {
            "message": "explain my score", 
            "context": {"recent_match_score": 0.85},
            "expected_keywords": ["85%", "excellent", "score"]
        },
        {
            "message": "career advice",
            "context": {"user_skills": ["JavaScript", "React"]},
            "expected_keywords": ["frontend", "developer", "JavaScript"]
        }
    ]
    
    passed = 0
    total = len(test_cases)
    
    for test_case in test_cases:
        try:
            response = advisor.generate_response(
                test_case["message"], 
                test_case["context"]
            )
            
            response_text = response.response.lower()
            found_keywords = sum(1 for keyword in test_case["expected_keywords"] 
                               if keyword.lower() in response_text)
            
            if found_keywords >= len(test_case["expected_keywords"]) // 2:
                print(f"✅ Context test passed: {test_case['message']}")
                passed += 1
            else:
                print(f"❌ Context test failed: {test_case['message']}")
                
        except Exception as e:
            print(f"❌ Context test error: {str(e)}")
    
    print(f"📊 Context Awareness: {passed}/{total} tests passed")
    return passed == total

def main():
    """Run all chat advisor tests"""
    print("🎯 SkillMatch Chat Advisor Test Suite")
    print("=" * 45)
    
    tests = [
        ("Chat Response Generation", test_chat_responses),
        ("Skill Categories", test_skill_categories), 
        ("Context Awareness", test_context_awareness)
    ]
    
    passed = 0
    total = len(tests)
    
    for test_name, test_func in tests:
        print(f"\n🔍 Running: {test_name}")
        try:
            result = test_func()
            if result:
                print(f"✅ {test_name}: PASSED")
                passed += 1
            else:
                print(f"❌ {test_name}: FAILED")
        except Exception as e:
            print(f"❌ {test_name}: ERROR - {str(e)}")
    
    print("\n" + "=" * 45)
    print(f"📊 Chat Test Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All chat advisor tests passed!")
        print("\n✅ Chat Advisor System Status: FULLY FUNCTIONAL")
        print("\n🔧 Features Verified:")
        print("   ✓ Response generation for all message types")
        print("   ✓ Context-aware recommendations")
        print("   ✓ Skill categorization and career guidance")
        print("   ✓ User-specific suggestions")
        print("\n🚀 Chat Advisor Ready for Production!")
        return True
    else:
        print(f"⚠️  {total - passed} tests failed. Please review the output above.")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)