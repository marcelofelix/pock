class CreateSellItems < ActiveRecord::Migration
  def change
    create_table :sell_items do |t|
      t.timestamps null: false
      t.decimal :value, null: false, precision: 9, scale: 2
      t.decimal :discount, null: false, precision: 9, scale: 2
      t.decimal :change, null: false, precision: 9, scale: 2
      t.decimal :payment, null: false, precision: 9, scale: 2
      t.string :status, null: false
    end
  end
end
