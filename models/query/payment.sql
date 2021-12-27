/* Post */
INSERT INTO payments (id, visible_id, order_id, total_payment) VALUES (NULL, '1234567891', '1234567890', '300');
INSERT INTO payments (id, visible_id, order_id, total_payment) VALUES (NULL, '1234567890', '1234567890', '300');
/* Get */
    /* All */
SELECT visible_id,order_id,total_payment FROM payments 
    /* By visible_id */
SELECT visible_id,order_id,total_payment FROM payments where visible_id='1234567890';
/* Put */
UPDATE payments SET
    total_payment = '700',
    order_id = '1234567891',
    WHERE payments.visible_id = '1234567890'; 