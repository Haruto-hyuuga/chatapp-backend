import requests
import json
from datetime import datetime
from pathlib import Path

LOG_DIR = Path("api_logs")
LOG_DIR.mkdir(exist_ok=True)

def pretty_json(data):
    try:
        return json.dumps(data, indent=4, ensure_ascii=False)
    except Exception:
        return str(data)

def prompt_headers():
    headers = {}
    print("\nEnter headers (key:value). Empty line to stop.")
    while True:
        line = input("Header > ").strip()
        if not line:
            break
        if ":" not in line:
            print("Invalid header format")
            continue
        k, v = line.split(":", 1)
        headers[k.strip()] = v.strip()
    return headers

def prompt_body():
    print("\nEnter JSON body (empty line to finish):")
    lines = []
    while True:
        line = input()
        if line.strip() == "":
            break
        lines.append(line)
    if not lines:
        return None
    return json.loads("\n".join(lines))

def log_to_file(content):
    ts = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
    file = LOG_DIR / f"request_{ts}.log"
    file.write_text(content, encoding="utf-8")
    print(f"\n📁 Output saved to {file}")

def main():
    print("\n==== Minimal API Client ====\n")

    method = input("HTTP Method (GET/POST/PUT/DELETE) > ").upper()
    url = input("URL > ").strip()

    headers = prompt_headers()
    body = None

    if method in ("POST", "PUT", "PATCH"):
        body = prompt_body()

    print("\n⏳ Sending request...\n")

    try:
        response = requests.request(
            method,
            url,
            headers=headers,
            json=body,
            timeout=15
        )

        log = []
        log.append("===== REQUEST =====")
        log.append(f"Method : {method}")
        log.append(f"URL    : {url}")
        log.append("Headers:")
        log.append(pretty_json(headers))
        if body:
            log.append("Body:")
            log.append(pretty_json(body))

        log.append("\n===== RESPONSE =====")
        log.append(f"Status : {response.status_code}")
        log.append("Headers:")
        log.append(pretty_json(dict(response.headers)))

        try:
            data = response.json()
            log.append("Body:")
            log.append(pretty_json(data))
            print(pretty_json(data))
        except Exception:
            log.append("Body:")
            log.append(response.text)
            print(response.text)

        log_to_file("\n".join(log))

    except requests.exceptions.RequestException as e:
        print("❌ Request failed:", e)

if __name__ == "__main__":
    main()
