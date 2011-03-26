class CreateAddressGroups < ActiveRecord::Migration
  def self.up
    create_table :address_groups do |t|
      t.string :pref
      t.string :address
      t.integer :group_number
			t.string :group_code
    end
		add_index :address_groups, :address
  end

  def self.down
    drop_table :address_groups
  end
end
