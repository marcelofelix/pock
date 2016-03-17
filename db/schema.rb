# encoding: UTF-8
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
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20160317020033) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "products", force: :cascade do |t|
    t.datetime "created_at",                          null: false
    t.datetime "updated_at",                          null: false
    t.integer  "supplier_id",                         null: false
    t.string   "name",                                null: false
    t.integer  "count",                               null: false
    t.string   "ean",                                 null: false
    t.decimal  "cost",        precision: 8, scale: 2, null: false
    t.decimal  "price",       precision: 8, scale: 2, null: false
  end

  add_index "products", ["ean"], name: "index_products_on_ean", using: :btree

  create_table "purchase_items", force: :cascade do |t|
    t.datetime "created_at",                          null: false
    t.datetime "updated_at",                          null: false
    t.integer  "purchase_id",                         null: false
    t.string   "name",                                null: false
    t.integer  "count",                               null: false
    t.string   "ean",                                 null: false
    t.decimal  "price",       precision: 8, scale: 2, null: false
  end

  add_index "purchase_items", ["ean"], name: "index_purchase_items_on_ean", using: :btree

  create_table "purchases", force: :cascade do |t|
    t.integer  "supplier_id",                         null: false
    t.datetime "created_at",                          null: false
    t.datetime "updated_at",                          null: false
    t.string   "code",                                null: false
    t.decimal  "total",       precision: 8, scale: 2, null: false
  end

  create_table "suppliers", force: :cascade do |t|
    t.string   "name",       null: false
    t.string   "cnpj",       null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

end
