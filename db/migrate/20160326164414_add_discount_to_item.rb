class AddDiscountToItem < ActiveRecord::Migration
  def change
    add_column :sell_items, :discount, :integer
  end
end
