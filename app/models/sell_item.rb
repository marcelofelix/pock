class SellItem < ActiveRecord::Base
  before_save :calc_total

  belongs_to :sell

  private

  def calc_total
    value = discount.nil? ? 0: price * discount / 100
    self.total = (count - value) * price
  end
end
