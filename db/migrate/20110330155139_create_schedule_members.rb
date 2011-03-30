class CreateScheduleMembers < ActiveRecord::Migration
  def self.up
    create_table :schedule_members do |t|
      t.integer :schedule_id

      t.integer :group_number
			t.string :group_code
      t.string :state

      t.timestamps
    end
  end

  def self.down
    drop_table :schedule_members
  end
end
