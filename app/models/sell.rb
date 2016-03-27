class Sell < ActiveRecord::Base
  before_save :calc_total
  has_many :sell_items


  def << product
    newItem = product.to_item
    item = sell_items.find{|i| i.product_id == newItem.product_id}
    if(not item.nil?)
      item.count += 1
    else
      item = newItem
      item.sell = self
      sell_items << item
    end
    item.save
    item
  end

  private

  def calc_total
    self.total = sell_items.reduce(0){|sum, n| sum + n.total}
  end

end
