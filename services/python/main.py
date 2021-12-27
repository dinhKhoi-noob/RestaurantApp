from flask import Flask,jsonify,make_response, redirect, request, url_for,current_app
from flask_cors import CORS
from flask_mysqldb import MySQL

app = Flask(__name__)

app.config['MYSQL_HOST'] = '127.0.0.1'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = ''
app.config['MYSQL_DB'] = 'ecommercejs'

mysql = MySQL(app)
CORS(app,resources={r"/*": {"origins": "*"}})
@app.route('/', methods=['GET'])
def index():
    return 'Flask'
def branch_and_bound(current_item, temporary_highest_price, user_balance_calculating, products, quantity_storage, total_value, upper_bound, products_length):
    maximum_product_can_buy = min(
        user_balance_calculating / products[current_item][5], 1)
    for t in range(int(maximum_product_can_buy), -1, -1):
        total_value = total_value + t * products[current_item][2]
        user_balance_calculating = user_balance_calculating - t * products[current_item][5]
        if current_item != len(products) - 1:
            upper_bound = total_value + user_balance_calculating * products[current_item + 1][6]
        if upper_bound > temporary_highest_price:
            quantity_storage[current_item] = t
            if current_item == len(products) - 1 or user_balance_calculating <= 0.0:
                temporary_highest_price = update_temporary_best_choice(products, quantity_storage, total_value, temporary_highest_price, products_length)
            else:
                temporary_highest_price = branch_and_bound(current_item + 1, temporary_highest_price, user_balance_calculating, products, quantity_storage, total_value, upper_bound, products_length)
        quantity_storage[current_item] = 0
        total_value = total_value - t * products[current_item][2]
        user_balance_calculating = user_balance_calculating + t * products[current_item][5]
    return temporary_highest_price

def update_temporary_best_choice(products, quantity_storage, total_value,temporary_highest_price, products_length):
    if (temporary_highest_price < total_value):
        temporary_highest_price = total_value
        for current_item in range(0, products_length, 1):
            products[current_item][7] = quantity_storage[current_item]
    return temporary_highest_price

@app.route('/calculate/<user_id>',methods=['POST'])
def calculate(user_id):
    try:
        data = request.get_json()
        root_id = data['root_id']
        category_id = data['category_id']
        limit_range = data['limit_range']
        print(limit_range)
        print(root_id,category_id)
        category_result = []
        for index in range (0,len(category_id),1):
            if(category_id[index] != '-'):
                category_result.append(category_id[index][0])
        cursor = mysql.connection.cursor()
        cursor.execute("select balance from users where visible_id = '"+str(user_id)+"'")
        user = cursor.fetchall()
        products = []
        for index in range(0,len(root_id),1):
            cursor.execute("select visible_id, title, price, sale_percent, thumbnail from products where root_category='"+root_id[index]+"' and on_sale = 1 and is_active=1 order by sale_percent DESC")
            response = cursor.fetchall()
            response = list(response)
            products.extend(response)
        for index in range(0,len(category_result),1):
            print("select visible_id, title, price, sale_percent, thumbnail from products where category_id='"+category_result[index]+"' and on_sale = 1 and is_active=1 order by sale_percent DESC")
            cursor.execute("select visible_id, title, price, sale_percent, thumbnail from products where category_id='"+category_result[index]+"' and on_sale = 1 and is_active=1 order by sale_percent DESC")
            response = cursor.fetchall()
            response = list(response)
            products.extend(response)
        cursor.close()
        if not user:
            response = make_response(
                jsonify(
                    {"message": "User not found","success":False}
                ),
                404,
            )
            return response
        user_balance = float(limit_range)
        total_value = 0
        user_balance_calculating = user_balance
        temporary_highest_price = 0
        products = list(products)
        products_length = len(products)    
        quantity_storage = []
        for index in range(0, products_length, 1):
            quantity_storage.append(0)
            products[index] = list(products[index])
            current_price = products[index][2]*(100-products[index][3])/100
            products[index].append(current_price)
            value = products[index][2]/products[index][5]
            products[index].extend([value,0])
        for first_index in range(0,len(products),1):
            for second_index in range(first_index,len(products),1):
                if(products[first_index][6] < products[second_index][6]):
                    temporary = products[first_index]
                    products[first_index] = products[second_index]
                    products[second_index] = temporary
        upper_bound = (float)(user_balance * (products[0][3] / 100))
        branch_and_bound(0, temporary_highest_price, user_balance_calculating, products, quantity_storage, total_value, upper_bound, products_length)
        result = []
        for i in range (0,len(products),1):
            if(products[i][7] == 1):
                result.append([products[i][0],products[i][1],products[i][2],products[i][3],products[i][4]])
        print(result)
        if(len(result) > 0):
            response = make_response(
                jsonify(
                    {"message": "success","success":True,"data":result}
                ),
                200
            )
        else:
            response = make_response(
                jsonify(
                    {"message": "Not found","success":False}
                ),
                400
            )
        response.headers["Content-Type"] = "application/json"
        return response
    except:
        response = make_response(
            jsonify(
                {"message": "Internal server failed","success":False}
            ),
            500
        )
        return response
if __name__ == '__main__':
    app.run(debug=True)