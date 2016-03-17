class CreatePurchases < ActiveRecord::Migration
  def change
    create_table :purchases do |t|
      t.integer :supplier_id, :null => false, :references => [:supplier, :id]
      t.timestamps null: false
      t.string :code, null: false
      t.decimal :total, null: false, precision: 8, scale: 2
    end
  end
end
