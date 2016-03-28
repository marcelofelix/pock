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
    value = sell_items.reduce(0){|sum, n| sum + n.total}
    if not discount.nil?
      value = value - (value * discount / 100)
    end
    self.total = value
    if not self.payment.nil? and self.payment > self.total
      self.charge = self.payment - self.total
    end
  end

end
