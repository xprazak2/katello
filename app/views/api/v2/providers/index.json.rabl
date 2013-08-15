node(:total) { @collection[:total] }
node(:subtotal) { @collection[:subtotal] }

node :records do
  partial("api/v2/providers/show", :object => @collection[:records])
end
