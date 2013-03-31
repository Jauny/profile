module ApplicationHelper
  class HTMLwithPygments < Redcarpet::Render::HTML
    def block_code(code, language)
      Pygments.highlight(code, lexer:language)
    end
  end

  def markdown(text)
    renderer = HTMLwithPygments.new(hard_wrap: true, filter_html: true)
    options = {
      autolink: true,
      no_intra_emphasis: true,
      fenced_code_blocks: true,
      lax_html_blocks: true,
      strikethrough: true,
      superscript: true
    }
    Redcarpet::Markdown.new(renderer, options).render(text).html_safe
  end

  def icon(name, size=1)
    html = "<i class='icon-#{name}' "
    html += "style='font-size:#{size}em' "
    html += "></i>"
    html.html_safe
  end
end
