/* Post */
INSERT INTO order_items (id, visible_id, order_id, product_id) VALUES (NULL, '1234567890', '1234567890', '1234567890');
INSERT INTO order_items (id, visible_id, order_id, product_id) VALUES (NULL, '1234567891', '1234567890', '1234567890');
/* Get */
    /* All */
SELECT visible_id,order_id,product_id FROM order_items 
    /* By visible_id */
SELECT visible_id,order_id,product_id FROM order_items where visible_id='1234567890';
/* Put */
UPDATE order_items SET
    order_id = '1234567891',
    product_id = '1234567891'
    WHERE orders.visible_id = '1234567890';