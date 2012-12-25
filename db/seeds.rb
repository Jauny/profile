# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

puts "Creating posts..."

Post.create(:title => "First title", :content => "this is the super nice first content")
Post.create(:title => "second title", :content => "this is the super nice second content")
Post.create(:title => "third title", :content => "this is the super nice third content")
Post.create(:title => "fourth title", :content => "this is the super nice fourth content")