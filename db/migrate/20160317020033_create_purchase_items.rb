class CreatePurchaseItems < ActiveRecord::Migration
  def change
    create_table :purchase_items do |t|
      t.timestamps null: false
      t.integer :purchase_id, :null => false, :references => [:purchase, :id]
      t.string :name, null: false
      t.integer :count, null: false
      t.string :ean, null: false, index: true
      t.decimal :price, null: false, precision: 8, scale: 2
    end
  end
end
