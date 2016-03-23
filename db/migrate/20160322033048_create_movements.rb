class CreateMovements < ActiveRecord::Migration
  def change
    create_table :movements do |t|

      t.timestamps null: false
      t.integer :product_id, null: false, references: [:product, :id]
      t.string :type, null: false
      t.integer :count, null: false
    end
  end
end
