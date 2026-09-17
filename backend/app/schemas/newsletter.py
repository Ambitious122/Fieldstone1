from pydantic import BaseModel, EmailStr


class NewsletterRequest(BaseModel):
    email: EmailStr


class NewsletterResponse(BaseModel):
    success: bool
    message: str
