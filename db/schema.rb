# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20110327021650) do

  create_table "address_groups", :force => true do |t|
    t.string  "pref"
    t.string  "address"
    t.integer "group_number"
    t.string  "group_code"
  end

  add_index "address_groups", ["address"], :name => "index_address_groups_on_address"

  create_table "schedules", :force => true do |t|
    t.date     "effect_at"
    t.integer  "group_number"
    t.string   "group_code"
    t.integer  "state_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "states", :force => true do |t|
    t.string "label"
  end

end
