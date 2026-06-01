from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session

from database import engine, get_db
from models import Base, Product, Customer
from schemas import (
    ProductCreate,
    ProductResponse,
    CustomerCreate,
    CustomerResponse
)

Base.metadata.create_all(bind=engine)

app = FastAPI()


@app.get("/")
def root():
    return {"message": "Inventory API Running"}


@app.post("/products", response_model=ProductResponse)
def create_product(product: ProductCreate,
                   db: Session = Depends(get_db)):

    existing = db.query(Product).filter(
        Product.sku == product.sku
    ).first()

    if existing:
        raise HTTPException(
            status_code=400,
            detail="SKU already exists"
        )

    if product.quantity < 0:
        raise HTTPException(
            status_code=400,
            detail="Quantity cannot be negative"
        )

    new_product = Product(
        name=product.name,
        sku=product.sku,
        price=product.price,
        quantity=product.quantity
    )

    db.add(new_product)
    db.commit()
    db.refresh(new_product)

    return new_product


@app.get("/products", response_model=list[ProductResponse])
def get_products(db: Session = Depends(get_db)):
    return db.query(Product).all()

@app.get("/products/{product_id}", response_model=ProductResponse)
def get_product(product_id: int,
                db: Session = Depends(get_db)):

    product = db.query(Product).filter(
        Product.id == product_id
    ).first()

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    return product

@app.put("/products/{product_id}",
         response_model=ProductResponse)
def update_product(
        product_id: int,
        product: ProductCreate,
        db: Session = Depends(get_db)):

    # Check if product exists
    db_product = db.query(Product).filter(
        Product.id == product_id
    ).first()

    if not db_product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    # Prevent duplicate SKU
    existing_sku = db.query(Product).filter(
        Product.sku == product.sku,
        Product.id != product_id
    ).first()

    if existing_sku:
        raise HTTPException(
            status_code=400,
            detail="SKU already exists"
        )

    # Prevent negative quantity
    if product.quantity < 0:
        raise HTTPException(
            status_code=400,
            detail="Quantity cannot be negative"
        )

    # Update fields
    db_product.name = product.name
    db_product.sku = product.sku
    db_product.price = product.price
    db_product.quantity = product.quantity

    db.commit()
    db.refresh(db_product)

    return db_product

@app.delete("/products/{product_id}")
def delete_product(product_id: int,
                   db: Session = Depends(get_db)):

    product = db.query(Product).filter(
        Product.id == product_id
    ).first()

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    db.delete(product)
    db.commit()

    return {"message": "Product deleted"}

@app.post("/customers",
          response_model=CustomerResponse)
def create_customer(
        customer: CustomerCreate,
        db: Session = Depends(get_db)):

    existing = db.query(Customer).filter(
        Customer.email == customer.email
    ).first()

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Email already exists"
        )

    new_customer = Customer(
        name=customer.name,
        email=customer.email,
        phone=customer.phone
    )

    db.add(new_customer)
    db.commit()
    db.refresh(new_customer)

    return new_customer

@app.get("/customers",
         response_model=list[CustomerResponse])
def get_customers(
        db: Session = Depends(get_db)):
    return db.query(Customer).all()

@app.get("/customers/{customer_id}",
         response_model=CustomerResponse)
def get_customer(
        customer_id: int,
        db: Session = Depends(get_db)):

    customer = db.query(Customer).filter(
        Customer.id == customer_id
    ).first()

    if not customer:
        raise HTTPException(
            status_code=404,
            detail="Customer not found"
        )

    return customer

@app.delete("/customers/{customer_id}")
def delete_customer(
        customer_id: int,
        db: Session = Depends(get_db)):

    customer = db.query(Customer).filter(
        Customer.id == customer_id
    ).first()

    if not customer:
        raise HTTPException(
            status_code=404,
            detail="Customer not found"
        )

    db.delete(customer)
    db.commit()

    return {"message": "Customer deleted"}

