/* Post */
INSERT INTO products (id, visible_id, title, category_id, price, is_active) VALUES (NULL, '1234567890', 'Original Wine', '1234567891', '20', '1');
INSERT INTO products (id, visible_id, title, category_id, price, is_active) VALUES (NULL, '1234567891', 'Red Wine', '1234567891', '30', '1');
/* Get */
    /* All */
    SELECT visible_id,title,category_id,price,is_active FROM products;
    /* By visible_id */
    SELECT visible_id,title,category_id,price,is_active FROM products where visible_id='1234567890';
/* Put */
UPDATE products SET
    title = 'White Wine',
    category_id = '1234567890',
    price = '30',
    WHERE products.visible_id = '1234567890';
/* Delete */
UPDATE products SET
    is_active = '0'
    WHERE products.visible_id = '1234567890';
SELECT *
FROM products
WHERE title LIKE 'piz%'