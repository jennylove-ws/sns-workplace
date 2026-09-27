"""
Cloud Text-to-Speech API 예제.
텍스트를 mp3 파일로 변환합니다.

사전 준비:
  pip install -r requirements.txt
  gcloud services enable texttospeech.googleapis.com
  .env 파일에 GOOGLE_APPLICATION_CREDENTIALS 설정
"""

import os
from dotenv import load_dotenv
from google.cloud import texttospeech

load_dotenv()


def text_to_speech(text: str, output_path: str = "output.mp3") -> None:
    client = texttospeech.TextToSpeechClient()

    synthesis_input = texttospeech.SynthesisInput(text=text)

    voice = texttospeech.VoiceSelectionParams(
        language_code="ko-KR",
        name="ko-KR-Chirp3-HD-Aoede",  # Chirp 3 HD 한국어 보이스
    )

    audio_config = texttospeech.AudioConfig(
        audio_encoding=texttospeech.AudioEncoding.MP3
    )

    response = client.synthesize_speech(
        input=synthesis_input, voice=voice, audio_config=audio_config
    )

    with open(output_path, "wb") as out:
        out.write(response.audio_content)

    print(f"오디오 저장 완료: {output_path}")


if __name__ == "__main__":
    text_to_speech("안녕하세요, Vertex AI 텍스트 투 스피치 테스트입니다.")
