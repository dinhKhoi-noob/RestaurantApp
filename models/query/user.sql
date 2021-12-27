/* Post */
insert into users(visible_id,email,address,phone,username,password) values('1234567890','khoi@gmail.com','can tho','0123456789','dinhkhoi','123');
insert into users(visible_id,email,address,phone,username,password) values('1234567891','khoi@gmail.com','can tho','0123456789','dinhkhoi','123');
/* Get */
    /* All */
select visible_id,email,address,phone,username,password,balance,total_saving from users;
    /* By visible_id */
select visible_id,email,address,phone,username,password,balance,total_saving from users where visible_id='1234567891';
/* Put */
UPDATE users SET 
    email = 'khoine@gmail.com',
    address = 'can tho que toi',
    phone = '0123456781',
    username = 'dinhkhoine',
    password = '1234',
    balance = '1',
    total_saving = '1'
    WHERE users.visible_id = '1234567890'; 