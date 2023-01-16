function jScroll(){
	this.id = arguments[0];
	this.type = arguments[1] == 'h' ? 'h' : 'v';
	this.width = typeof arguments[2] == 'number' ? arguments[2] : null;
	this.height = typeof arguments[3] == 'number' ? arguments[3] : null;
	this.$obj = null;
	this.is_scroll = false;
	this.start_pos = null;
	this.init();
}

jScroll.prototype.init = function(){
	this.$obj = $(this.id);
	if(this.$obj.length == 1){
		this.$obj.addClass('jScroll');
		if(this.width != null) this.$obj.css('width', this.width);
		if(this.height != null) this.$obj.css('height', this.height);
		this.bindEvent();
	}
};

jScroll.prototype.bindEvent = function(){
	var _this = this;
	this.$obj.on('mousedown', function(event){
		_this.is_scroll = true;
		_this.start_pos = {
			base_x: _this.$obj.scrollLeft(),
			base_y: _this.$obj.scrollTop(),
			x: event.pageX,
			y: event.pageY
		};
		_this.$obj.css('cursor', 'move');
	});
	$(document).on('mouseup', function(){
		_this.is_scroll = false;
		_this.$obj.css('cursor', 'default');
	});
	$(document).on('mousemove', function(event){
		if(_this.is_scroll){
			var dist;
			if(_this.type == 'h'){
				var x = event.pageX;
				dist = _this.start_pos.base_x - x + _this.start_pos.x;
				_this.$obj.scrollLeft(dist);
			}else{
				var y = event.pageY;
				dist = _this.start_pos.base_y - y + _this.start_pos.y;
				_this.$obj.scrollTop(dist);
			}
		}
	});
	this.$obj.get(0).addEventListener('touchstart', function(event){
		if(event.targetTouches.length == 1){
			//event.preventDefault();
			_this.is_scroll = true;
			_this.start_pos = {
				base_x: _this.$obj.scrollLeft(),
				base_y: _this.$obj.scrollTop(),
				x: event.targetTouches[0].pageX,
				y: event.targetTouches[0].pageY
			};
			_this.$obj.css('cursor', 'move');
		}
	});
	this.$obj.get(0).addEventListener('touchend', function(event){
		_this.is_scroll = false;
		_this.$obj.css('cursor', 'default');
	});
	this.$obj.get(0).addEventListener('touchmove', function(event){
		if(_this.is_scroll){
			if(event.targetTouches.length == 1){
				//event.preventDefault();
				var dist;
				if(_this.type == 'h'){
					var x = event.targetTouches[0].pageX;
					dist = _this.start_pos.base_x - x + _this.start_pos.x;
					_this.$obj.scrollLeft(dist);
				}else{
					var y = event.targetTouches[0].pageY;
					dist = _this.start_pos.base_y - y + _this.start_pos.y;
					_this.$obj.scrollTop(dist);
				}
			}
		}
	});
};

export default (function($){
	$.fn.extend({
		jScroll: function (options) {
			var defaults = {
				type	: 'h',
				width	: null,
				height	: null
			};
			var opts = $.extend(defaults, options);
			return this.each(function(){
				new jScroll(this, opts.type, opts.width, opts.height);
				return false;
			});
		}
	});
});
