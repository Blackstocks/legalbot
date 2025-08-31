#!/usr/bin/env python
"""
Quick test script to verify API endpoints are working
"""
import requests

BASE_URL = "http://localhost:8000"

def test_health():
    response = requests.get(f"{BASE_URL}/health")
    print(f"Health Check: {response.status_code} - {response.json()}")

def test_v1():
    response = requests.get(f"{BASE_URL}/v1")
    print(f"V1 Info: {response.status_code} - {response.json()}")

def test_stats():
    response = requests.get(f"{BASE_URL}/v1/api/stats")
    print(f"Stats: {response.status_code} - {response.json()}")

def test_chat():
    data = {"message": "Hello, how are you?"}
    response = requests.post(f"{BASE_URL}/v1/api/chat", json=data)
    print(f"Chat: {response.status_code} - {response.json()}")

if __name__ == "__main__":
    print("Testing API endpoints...")
    print("-" * 50)
    
    test_health()
    test_v1()
    test_stats()
    test_chat()