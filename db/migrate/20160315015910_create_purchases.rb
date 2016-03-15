class CreatePurchases < ActiveRecord::Migration
  def change
    create_table :purchases do |t|
      t.integer :supplier_id, :null => false, :references => [:supplier, :id]
      t.timestamps null: false
      t.decimal :price, null: false, precision: 5, scale: 2
    end
  end
end
