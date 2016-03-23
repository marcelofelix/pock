class CreateSells < ActiveRecord::Migration
  def change
    create_table :sells do |t|
      t.timestamps null: false
      t.string :ean, null: false, index: true
      t.decimal :price, null: false, precision: 8, scale: 2
      t.decimal :total, null: false, precision: 8, scale: 2
      t.integer :count, null: false
      t.string :name, null: false
      t.decimal :discount, null: true, precision: 8, scale: 2
      t.integer :sell_id, null: false, references: [:sell, :id]
      t.integer :product_id, null: false, references: [:product, :id]
    end
  end
end
