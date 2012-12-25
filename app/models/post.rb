class Post < ActiveRecord::Base
  attr_accessible :content, :title

  def previous_post
    begin
      Post.find(self.id - 1)
    rescue
      Post.last
    end
  end

  def next_post
    begin
      Post.find(self.id + 1)
    rescue
      Post.first
    end  
  end

  def preview
    self.content.split[0..40].join(" ") + "..."
  end

  def date
    self.created_at.strftime('%a, %B %d')
  end
end
