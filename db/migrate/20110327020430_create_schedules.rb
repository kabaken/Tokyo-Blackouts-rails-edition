class CreateSchedules < ActiveRecord::Migration
  def self.up
    create_table :schedules do |t|
      t.date :effect_at

      t.timestamps
    end
  end

  def self.down
    drop_table :schedules
  end
end
