/* Post */
INSERT INTO orders (id, visible_id, date_created, user_id) VALUES (NULL, '1234567890', '2021-09-01', '1234567890');
INSERT INTO orders (id, visible_id, date_created, user_id) VALUES (NULL, '1234567891', '2021-09-01', '1234567890');
/* Get */
    /* All */
SELECT visible_id, date_created, user_id FROM orders
    /* By visible_id */
SELECT visible_id, date_created, user_id FROM orders where visible_id='1234567890';
/* Put */
UPDATE orders SET
date_created = '2021-09-02',
user_id = '1234567891'
WHERE orders.visible_id = '1234567890'; 