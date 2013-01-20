class Post < ActiveRecord::Base
  attr_accessible :content, :title

  def previous_post
    previous_posts = Post.where [ 'created_at < ?', self.created_at ]
    previous_post = previous_posts.find(:all, :order => 'created_at DESC').first

    previous_post.nil? ? Post.find(:all, :order => 'created_at DESC').first : previous_post
  end

  def next_post
    next_posts = Post.where [ 'created_at > ?', self.created_at ]
    next_post = next_posts.find(:all, :order => 'created_at ASC').first

    next_post.nil? ? Post.find(:all, :order => 'created_at ASC').first : next_post
  end

  def preview
    self.content.split[0..40].join(" ") + "..."
  end

  def date
    self.created_at.strftime('%a, %B %d')
  end
end
