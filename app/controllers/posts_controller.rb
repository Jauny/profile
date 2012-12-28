class PostsController < ApplicationController
  http_basic_authenticate_with :name => ENV["NAME"], :password => ENV["PASS"], :except => [:index, :show]

  def index
    @posts = Post.all.sort { |a,b| b.created_at <=> a.created_at }
  end

  def show
    @post = Post.find(params[:id])
    @previous = @post.previous_post
    @next = @post.next_post
  end

  def new
    @post = Post.new
  end

  def create
    @post = Post.new(params[:post])

    if @post.save
      redirect_to @post
    else
      render 'new'
      flash[:notice] = "WTF?!"
    end
  end

  def edit
    @post = Post.find(params[:id])
  end

  def update
    @post = Post.find(params[:id])
    @post.update_attributes(params[:post])

    if @post.save
      redirect_to @post
    else
      render 'edit'
      flash[:notice] = "WTF?!"
    end
  end

  def destroy
  end
end
