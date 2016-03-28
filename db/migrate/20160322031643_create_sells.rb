class CreateSells < ActiveRecord::Migration
  def change
    create_table :sells do |t|
      t.timestamps null: false
      t.decimal :discount, null: true, precision: 9, scale: 2
      t.decimal :charge, null: true, precision: 9, scale: 2
      t.decimal :payment, null: true, precision: 9, scale: 2
      t.decimal :total, null: true, precision: 8, scale: 2
      t.decimal :discount, null: true, precision: 8, scale: 2
      t.string :status, null: false
    end
  end
end
