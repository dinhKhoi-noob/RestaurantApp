/* Post */
INSERT INTO product_on_sales (id, visible_id, product_id, is_active, discount_id) VALUES (NULL, '1234567890', '1234567890', '1', '1234567890');
INSERT INTO product_on_sales (id, visible_id, product_id, is_active, discount_id) VALUES (NULL, '1234567891', '1234567890', '1', '1234567890');
/* Get */
    /* All */
SELECT visible_id,product_id,is_active,discount_id FROM product_on_sales
    /* By visible_id */
SELECT visible_id,product_id,is_active,discount_id FROM product_on_sales where visible_id='1234567890';
/* Put */
UPDATE product_on_sales SET
    discount_id = '1234567891',
    product_id = '1234567891',
    WHERE product_on_sales.visible_id = '1234567890'; 
/* Delete */
UPDATE product_on_sales SET
    is_active = '0'
    WHERE products.visible_id = '1234567890';