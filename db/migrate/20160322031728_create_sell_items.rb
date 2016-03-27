class CreateSellItems < ActiveRecord::Migration
  def change
    create_table :sell_items do |t|
      t.timestamps null: false
      t.string :status, null: false
      t.string :ean, null: false, index: true
      t.integer :count, null: false
      t.integer :product_id, null: false, references: [:product, :id]
      t.decimal :price, null: false, precision: 9, scale: 2
      t.decimal :total, null: false, precision: 9, scale: 2
      t.string :name, null: false
      t.integer :sell_id, null: false, references: [:sell, :id]
    end
  end
end
