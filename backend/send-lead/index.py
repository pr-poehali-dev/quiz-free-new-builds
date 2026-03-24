import json
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


def handler(event: dict, context) -> dict:
    """Отправляет заявку из квиза на почту агента."""
    cors_headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    }

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": cors_headers, "body": ""}

    try:
        body = json.loads(event.get("body") or "{}")
        name = body.get("name", "").strip()
        phone = body.get("phone", "").strip()
        email = body.get("email", "").strip()
        answers = body.get("answers", {})

        if not name or not phone:
            return {
                "statusCode": 400,
                "headers": cors_headers,
                "body": json.dumps({"error": "Имя и телефон обязательны"}),
            }

        answer_labels = {
            "studio": "Студия", "1room": "1-комнатная", "2room": "2-комнатная", "3room": "3+ комнаты",
            "live": "Для проживания", "invest": "Инвестиции", "rent": "Под аренду", "children": "Детям / близким",
            "budget1": "До 5 млн ₽", "budget2": "5–10 млн ₽", "budget3": "10–20 млн ₽", "budget4": "Свыше 20 млн ₽",
            "center": "Центр города", "suburb": "Новые районы", "eco": "Экология и парки", "transport": "Рядом с метро",
            "now": "Прямо сейчас", "3month": "В течение 3 месяцев", "6month": "В течение полугода", "year": "Просто изучает рынок",
        }

        questions = [
            "Тип недвижимости",
            "Цель покупки",
            "Бюджет",
            "Локация",
            "Срок покупки",
        ]

        quiz_rows = ""
        for i, question in enumerate(questions):
            answer_id = answers.get(str(i), "")
            answer_text = answer_labels.get(answer_id, answer_id or "—")
            quiz_rows += f"""
            <tr>
              <td style="padding:8px 12px;border-bottom:1px solid #f0ede8;color:#888;font-size:13px;width:45%">{question}</td>
              <td style="padding:8px 12px;border-bottom:1px solid #f0ede8;font-weight:600;font-size:13px">{answer_text}</td>
            </tr>"""

        email_body = f"""
        <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:560px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08)">
          <div style="background:linear-gradient(135deg,#ea6b14,#e0502a);padding:28px 32px">
            <h1 style="margin:0;color:#fff;font-size:22px;font-weight:700">Новая заявка с квиза</h1>
            <p style="margin:6px 0 0;color:rgba(255,255,255,0.8);font-size:14px">NovaRealty — подбор новостроек</p>
          </div>
          <div style="padding:28px 32px">
            <table style="width:100%;border-collapse:collapse;margin-bottom:20px;background:#faf9f7;border-radius:12px;overflow:hidden">
              <tr>
                <td style="padding:12px 16px;font-size:13px;color:#888;width:45%">Имя</td>
                <td style="padding:12px 16px;font-weight:700;font-size:15px;color:#1a1a2e">{name}</td>
              </tr>
              <tr style="background:#fff">
                <td style="padding:12px 16px;font-size:13px;color:#888">Телефон</td>
                <td style="padding:12px 16px;font-weight:700;font-size:15px;color:#ea6b14">
                  <a href="tel:{phone}" style="color:#ea6b14;text-decoration:none">{phone}</a>
                </td>
              </tr>
              {'<tr><td style="padding:12px 16px;font-size:13px;color:#888">Email</td><td style="padding:12px 16px;font-size:14px">' + email + '</td></tr>' if email else ''}
            </table>

            <h3 style="margin:0 0 12px;font-size:14px;color:#555;font-weight:600;text-transform:uppercase;letter-spacing:0.5px">Ответы на квиз</h3>
            <table style="width:100%;border-collapse:collapse;background:#faf9f7;border-radius:12px;overflow:hidden">
              {quiz_rows}
            </table>

            <div style="margin-top:24px;padding:16px;background:#fff7f0;border-radius:12px;border-left:3px solid #ea6b14">
              <p style="margin:0;font-size:13px;color:#555">
                ⏱ Рекомендуется связаться в течение <strong>15 минут</strong> — клиент ожидает звонка.
              </p>
            </div>
          </div>
          <div style="padding:16px 32px;background:#faf9f7;border-top:1px solid #f0ede8;text-align:center">
            <p style="margin:0;font-size:12px;color:#aaa">NovaRealty · Автоматическое уведомление</p>
          </div>
        </div>
        """

        smtp_user = "Rabotalid2026@mail.ru"
        smtp_password = os.environ.get("SMTP_PASSWORD", "")

        msg = MIMEMultipart("alternative")
        msg["Subject"] = f"🏠 Новая заявка: {name} — {phone}"
        msg["From"] = f"NovaRealty <{smtp_user}>"
        msg["To"] = smtp_user

        msg.attach(MIMEText(email_body, "html", "utf-8"))

        with smtplib.SMTP_SSL("smtp.mail.ru", 465) as server:
            server.login(smtp_user, smtp_password)
            server.sendmail(smtp_user, smtp_user, msg.as_string())

        return {
            "statusCode": 200,
            "headers": cors_headers,
            "body": json.dumps({"ok": True}),
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "headers": cors_headers,
            "body": json.dumps({"error": str(e)}),
        }