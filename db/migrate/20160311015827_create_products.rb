class CreateProducts < ActiveRecord::Migration
  def change
    create_table :products do |t|
      t.timestamps null: false
      t.integer :supplier_id, :null => false, :references => [:supplier, :id]
      t.string :name, null: false
      t.integer :count, null: false
      t.string :ean, null: false, index: true
      t.decimal :cost, null: false, precision: 8, scale: 2
      t.decimal :price, null: false, precision: 8, scale: 2
    end
  end
end
