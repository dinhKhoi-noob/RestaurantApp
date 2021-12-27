create table categories(
	id int AUTO_INCREMENT UNIQUE KEY,
    visible_id varchar(10) PRIMARY KEY,
    title varchar(50) NOT null,
    category_id varchar(10) NOT null,
    CONSTRAINT fk_category_id FOREIGN KEY(category_id) REFERENCES categories(visible_id)
);
CREATE table users(
    id int AUTO_INCREMENT UNIQUE KEY,
    visible_id varchar(10) PRIMARY KEY,
    email varchar(100) not null,
    address varchar(200) not null,
  	phone varchar(11) not null,
    username varchar(100) not null,
    password varchar(100) not null,
    balance int default 0,
    total_saving int default 0
);
create table products(
    id int AUTO_INCREMENT UNIQUE KEY,
    visible_id varchar(10) PRIMARY KEY,
    title varchar(50) not null,
    category_id varchar(10) not null,
    price int not null,
    is_active boolean default 1,
    constraint fk_product_category FOREIGN KEY(category_id) REFERENCES categories(visible_id)
);
CREATE TABLE discounts(
    id int AUTO_INCREMENT UNIQUE KEY,
    visible_id varchar(10) PRIMARY KEY,
    title varchar(50) not null,
    sale_percent int NOT null,
    date_begin date not null,
    date_end date NOT null
);
create table product_on_sales(
	id int AUTO_INCREMENT UNIQUE KEY,
    visible_id varchar(10) PRIMARY KEY,
    product_id varchar(10) not null,
    discount_id varchar(10) not null,
    constraint fk_on_sale_product_id FOREIGN KEY(discount_id) REFERENCES products(visible_id),
    constraint fk_sale_id FOREIGN KEY(sale_id) REFERENCES sales(visible_id)
    is_active boolean default 1
);
create table orders(
	id int AUTO_INCREMENT UNIQUE KEY,
    visible_id varchar(10) PRIMARY KEY,
    date_created date not null,
    user_id varchar(10) not null,
    constraint fk_order_user_id FOREIGN KEY(user_id) REFERENCES users(visible_id)
);
create table order_items(
	id int AUTO_INCREMENT UNIQUE KEY,
    visible_id varchar(10) PRIMARY KEY,
    order_id varchar(10) not null,
    product_id varchar(10) not null,
    constraint fk_order_item_order_id FOREIGN KEY(order_id) REFERENCES orders(visible_id),
    CONSTRAINT fk_order_item_product_id FOREIGN KEY(product_id) REFERENCES products(visible_id)
);
create table payments(
	id int AUTO_INCREMENT UNIQUE KEY,
    visible_id varchar(10) PRIMARY KEY,
    order_id varchar(10) not null,
    total_payment float not null,
    CONSTRAINT fk_payment_order_id FOREIGN KEY(order_id) REFERENCES orders(visible_id)
)