from pydantic import BaseModel, EmailStr
from pydantic import Field

class ProductCreate(BaseModel):
    name: str
    sku: str
    price: float = Field(gt=0)
    quantity: int = Field(ge=0)

class ProductResponse(ProductCreate):
    id: int

    class Config:
        from_attributes = True


class CustomerCreate(BaseModel):
    name: str
    email: EmailStr
    phone: str


class CustomerResponse(CustomerCreate):
    id: int

    class Config:
        from_attributes = True

class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int


class OrderCreate(BaseModel):
    customer_id: int
    items: list[OrderItemCreate] = Field(
        min_length=1
    )

class OrderItemResponse(BaseModel):
    id: int
    product_id: int
    quantity: int
    unit_price: float

    class Config:
        from_attributes = True

class OrderResponse(BaseModel):
    id: int
    customer_id: int
    total_amount: float
    items: list[OrderItemResponse]

    class Config:
        from_attributes = True
    
