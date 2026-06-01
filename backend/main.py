from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session

from database import engine, get_db

from models import (
    Base,
    Product,
    Customer,
    Order,
    OrderItem
)

from schemas import (
    ProductCreate,
    ProductResponse,
    CustomerCreate,
    CustomerResponse,
    OrderCreate,
    OrderResponse
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

@app.post(
    "/orders",
    response_model=OrderResponse
)
def create_order(
        order: OrderCreate,
        db: Session = Depends(get_db)):

    customer = db.query(Customer).filter(
        Customer.id == order.customer_id
    ).first()

    if not customer:
        raise HTTPException(
            status_code=404,
            detail="Customer not found"
        )

    total_amount = 0

    new_order = Order(
        customer_id=order.customer_id,
        total_amount=0
    )

    db.add(new_order)
    db.flush()

    for item in order.items:

        product = db.query(Product).filter(
            Product.id == item.product_id
        ).first()

        if not product:
            raise HTTPException(
                status_code=404,
                detail=f"Product {item.product_id} not found"
            )

        if item.quantity <= 0:
            raise HTTPException(
                status_code=400,
                detail="Quantity must be greater than zero"
            )

        if product.quantity < item.quantity:
            raise HTTPException(
                status_code=400,
                detail=f"Insufficient stock for {product.name}"
            )

        product.quantity -= item.quantity

        item_total = (
            product.price * item.quantity
        )

        total_amount += item_total

        order_item = OrderItem(
            order_id=new_order.id,
            product_id=product.id,
            quantity=item.quantity,
            unit_price=product.price
        )

        db.add(order_item)

    new_order.total_amount = total_amount

    db.commit()
    db.refresh(new_order)

    return new_order

@app.get(
    "/orders",
    response_model=list[OrderResponse]
)
def get_orders(
        db: Session = Depends(get_db)):

    return db.query(Order).all()

@app.get(
    "/orders/{order_id}",
    response_model=OrderResponse
)
def get_order(
        order_id: int,
        db: Session = Depends(get_db)):

    order = db.query(Order).filter(
        Order.id == order_id
    ).first()

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order not found"
        )

    return order

@app.delete("/orders/{order_id}")
def delete_order(
        order_id: int,
        db: Session = Depends(get_db)):

    order = db.query(Order).filter(
        Order.id == order_id
    ).first()

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order not found"
        )

    for item in order.items:

        product = db.query(Product).filter(
            Product.id == item.product_id
        ).first()

        if product:
            product.quantity += item.quantity

    db.delete(order)
    db.commit()

    return {
        "message": "Order deleted"
    }