module ApplicationHelper
  class NFe

    def initialize xml
      @xml = xml;
    end

    def import
      read_supplier
      read_purchase
      read_itens
      import_products
    end

    private

    def read_supplier
      emit = @xml.xpath("//emit").first
      @supplier = Supplier.find_by cnpj: emit.xpath('CNPJ').text;
      @supplier = Supplier.new if @supplier.nil?
      @supplier.name = emit.xpath('xNome').text
      @supplier.cnpj = emit.xpath('CNPJ').text
      @supplier.save
    end


    def read_purchase
      code = @xml.xpath('//protNFe/infProt/chNFe').text
      @purchase = Purchase.find_by code: code
      @purchase = Purchase.new(code: code) if @purchase.nil?
      @purchase.total = @xml.xpath('//infNFe/total/ICMSTot/vNF').text.to_f.round(2)
      @purchase.supplier = @supplier
      @purchase.save
    end


    def read_itens
      @itens = []
      itens = @xml.xpath('//prod')
      itens.each do |p|
        item = PurchaseItem.new
        item.name = p.xpath('xProd').text
        item.ean = p.xpath('cProd').text
        item.count = p.xpath('qCom').text.to_i
        item.price = p.xpath('vUnCom').text.to_f.round(2)
        item.purchase = @purchase
        item.save
        @itens << item
      end
    end

    def import_products
      products = Product.all
      @itens.each do |i|
        product = products.find{|p| p.ean == i.ean}
        if product.nil?
          product = Product.new(
            name: i.name,
            ean: i.ean,
            count: i.count,
            supplier: i.purchase.supplier
          )
        end
        product.cost = i.price
        product.price = i.price
        product.save
      end

    end
  end
end
