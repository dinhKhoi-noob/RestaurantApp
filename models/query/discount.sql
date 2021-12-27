/* Post */
INSERT INTO discounts (id, visible_id, title, sale_percent, date_begin, date_end) VALUES (NULL, '1234567891', 'For New Year Eve', '20', '2021-09-01', '2021-09-30');
INSERT INTO discounts (id, visible_id, title, sale_percent, date_begin, date_end) VALUES (NULL, '1234567890', 'For Chirstmas', '20', '2021-09-01', '2021-09-30');
/* Get */
    /* All */
SELECT visible_id,title,sale_percent,date_begin,date_end FROM discounts 
    /* By visible_id */
SELECT visible_id,title,sale_percent,date_begin,date_end FROM discounts WHERE visible_id='1234567890' 
/* Put */
UPDATE discounts SET
    title = 'For Christmas Eve',
    sale_percent = '15',
    date_begin = '2021-09-01',
    date_end = '2021-09-25'
    WHERE discounts.visible_id = '1234567890'; 