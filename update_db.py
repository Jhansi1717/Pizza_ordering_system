import sqlite3

conn = sqlite3.connect('pizza.db')
cursor = conn.cursor()
cursor.execute("SELECT id, name FROM pizzas")
rows = cursor.fetchall()

for row_id, name in rows:
    if "Pizza" not in name:
        new_name = f"{name} Pizza"
        cursor.execute("UPDATE pizzas SET name = ? WHERE id = ?", (new_name, row_id))

conn.commit()
conn.close()
print("Database updated successfully!")
