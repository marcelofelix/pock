class CreateProducts < ActiveRecord::Migration
  def change
    create_table :products do |t|
      t.timestamps null: false
      t.string :name, null: false
      t.integer :count, null: false
      t.string :ean, null: false, index: true
      t.decimal :price, null: false, precision: 5, scale: 2
    end
  end
end
