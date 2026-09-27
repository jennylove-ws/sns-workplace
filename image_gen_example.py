"""
Vertex AI Imagen 이미지 생성 예제.

사전 준비:
  pip install -r requirements.txt
  gcloud services enable aiplatform.googleapis.com
  .env 파일에 GOOGLE_CLOUD_PROJECT, GOOGLE_CLOUD_LOCATION, GOOGLE_APPLICATION_CREDENTIALS 설정
"""

import os
from dotenv import load_dotenv
import vertexai
from vertexai.preview.vision_models import ImageGenerationModel

load_dotenv()

PROJECT_ID = os.environ["GOOGLE_CLOUD_PROJECT"]
LOCATION = os.environ.get("GOOGLE_CLOUD_LOCATION", "us-central1")


def generate_image(prompt: str, output_path: str = "output.png") -> None:
    vertexai.init(project=PROJECT_ID, location=LOCATION)

    model = ImageGenerationModel.from_pretrained("imagen-4.0-generate-001")

    images = model.generate_images(
        prompt=prompt,
        number_of_images=1,
        aspect_ratio="1:1",
    )

    images[0].save(location=output_path)
    print(f"이미지 저장 완료: {output_path}")


if __name__ == "__main__":
    generate_image("따뜻한 햇살이 비치는 카페 창가에 앉은 고양이, 수채화 스타일")
