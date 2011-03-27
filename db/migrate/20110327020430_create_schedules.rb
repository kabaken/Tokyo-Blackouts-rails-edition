class CreateSchedules < ActiveRecord::Migration
  def self.up
    create_table :schedules do |t|
      t.date :effect_at
      t.integer :group_number
			t.string :group_code
      t.integer :state_id

      t.timestamps
    end
  end

  def self.down
    drop_table :schedules
  end
end
