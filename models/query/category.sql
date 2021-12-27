/* Categories */
/* Post */
insert into categories(visible_id,title,category_id) values('1234567890','Drink','1234567890');
insert into categories(visible_id,title,category_id) values('1234567891','Wine','1234567890');
/* Get */
    /* All */
select visible_id,title,category_id from categories
    /* By visible_id */
select visible_id,title,category_id from categories where visible_id='1234567890';
/* Put */
UPDATE categories SET title = 'Juice' WHERE categories.visible_id = '1234567891';