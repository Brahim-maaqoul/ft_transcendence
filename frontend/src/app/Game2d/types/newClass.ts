export interface Position
{
    x: number
    y: number
}

export interface PSize {
	width: number
	height: number
    texture?: string
    color: string
    position: Position
    scale: number
    rotation: number
    
}

export interface GameConfig {
	bricks: Array<PSize>
	ball: Array<PSize>
	paddle1: PSize
	paddle2: PSize
	score: {p1: number, p2: number}
	sec: number
	
}

export enum key
{

}

export class Game 
{
	gameId: number;
	playerId1: number;
	playerId2?: number;
	socket: {player1Socket: string, player2Socket?: string};
	playerAI: boolean;
	world: {h:number, w:number};
	// ball: Array<Ball>;
	ball: Ball;
	paddle: [Paddle, Paddle];
	bricks: Array<Brick>;
	score: {p1: number, p2: number};
	keysPressed: Set<string>;
	sec: number;
	time : Date;
	start: boolean;
	status: string;
	// turn: number;
	// round: number;
	// createAt: Date;
	// startedAt: Date;
	// updatedAt: Date;
	constructor(starting: boolean)
	{
		this.gameId = Math.floor(Math.random() * 1000);
		this.world = {h: 1000, w: 600}
		// this.ball = new Array();
		this.ball = new Ball(1000, 500, 20, 100);
		this.paddle = [new Paddle(40, 250, 150, 30), new Paddle(970, 250, 150, 30)]
		this.bricks = new Array();
		this.score = {p1: 0, p2: 0};
		this.keysPressed = new Set()
		this.sec = -1
		this.time = new Date()
		// this.start = false
		this.start = starting
		this.status = "waiting";
		this.playerAI = true;
		this.socket = {player1Socket: "", player2Socket: ""};
		this.playerId1 = 0;
	}
	get_data():GameConfig
	{
		const b = new Array(this.bricks)
		const data: GameConfig = {
			// ball: this.ball.map(value => value.get_data(this.world.h, this.world.w, 0xffffff)),
			ball: this.ball.get_data(this.world.h, this.world.w, 0xffffff),
			paddle1: this.paddle[0].get_data(this.world.h, this.world.w, 0xffffff),
			paddle2: this.paddle[1].get_data(this.world.h, this.world.w, 0xffffff),
			bricks: Array.from(this.bricks).map(value => value.get_data(this.world.h, this.world.w, 0xffffff)),
			score: this.score,
			sec: this.sec
		}
		return data
	}
	bot()
	{
		// if (this.ball.length)
		// {
		// 	if (this.ball[0].position.y < this.paddle[1].position.y)
		// 	 	this.paddle[1].move_left(1, 0)
		// 	if (this.ball[0].position.y > this.paddle[1].position.y)
		// 		this.paddle[1].move_right(1, 600)
		// }
		if (this.ball)
		{
			if (this.ball.position.y < this.paddle[1].position.y)
			 	this.paddle[1].move_left(1, 0)
			if (this.ball.position.y > this.paddle[1].position.y)
				this.paddle[1].move_right(1, 600)
		}
		else
		{
			if (this.world.w/2 < this.paddle[1].position.y)
			 	this.paddle[1].move_left(1, 0)
			if (this.world.w/2 > this.paddle[1].position.y)
				this.paddle[1].move_right(1, 600)
		}
	}
	check_keys()
	{

		this.paddle[0].rotate(0)
		// this.paddle[0].restScale()
		if (this.keysPressed.has('a') || this.keysPressed.has('A'))
			this.paddle[0].changeScale(1.5)
		if (this.keysPressed.has("ArrowUp") || this.keysPressed.has("ArrowLeft"))
			this.paddle[0].move_left(1, 0)
		if (this.keysPressed.has("ArrowDown") || this.keysPressed.has("ArrowRight"))
			this.paddle[0].move_right(1, 600)
		if (this.keysPressed.has('x'))
			this.paddle[0].rotate(Math.PI/6)
		else if (this.keysPressed.has('c'))
			this.paddle[0].rotate(-Math.PI/6)
		// if (this.keysPressed.has('w') || this.keysPressed.has('W'))
		// 	this.paddle[1].move_left(1, 0)
		// if (this.keysPressed.has('s') || this.keysPressed.has('S'))
		// 	this.paddle[1].move_right(1, 600)

		// if (this.keysPressed.has(' '))
		// 	this.start = true
		
	}
	check_intersection()
	{
		// if (this.ball.length)
		if (this.ball)
		{
			// this.paddle[0].check_intersection(this.ball[0], -1)
			// this.paddle[1].check_intersection(this.ball[0], 1)
			this.paddle[0].check_intersection(this.ball, -1)
			this.paddle[1].check_intersection(this.ball, 1)
			for(let i = 0;i < this.bricks.length ; i++ )
			{
				// const type = this.bricks[i].check_intersect(this.ball[0])
				const type = this.bricks[i].check_intersect(this.ball)
				if (type)
					this.bricks.pop()
			
				if (type == 1)
				{
					// if(this.ball[0].dx > 0)
					if(this.ball.dx > 0)
						this.paddle[0].changeScale(1.3)
					else
						this.paddle[1].changeScale(1.3)
				}
				if (type == 2)
				{
						// if(this.ball[0].dx > 0)
						if(this.ball.dx > 0)
							this.paddle[0].changeScale(0.7)
						else
							this.paddle[1].changeScale(0.7)
				}
				if (type == 3)
				{
						// this.ball[0].change_scale(1.3)
						this.ball.change_scale(1.3)
				}
				if (type == 4)
				{
					// this.ball[0].change_scale(0.7)
					this.ball.change_scale(0.7)
				}
				if (type == 5)
					// this.ball[0].setSpeed(3);
					this.ball.setSpeed(3);
				if(type == 6)
					// this.ball[0].setSpeed(4);
					this.ball.setSpeed(4);

			}	
			
		}
	}
	update()
	{
		this.check_keys()
		if(!this.start)
		{
			this.time = new Date()
			return ;
		}
		// if (!this.ball.length)
		if (!this.ball)
		{
			const now = new Date()
			this.sec = Math.floor((now.getTime() - this.time.getTime())/1000)
			if (this.sec >= 3)
			{
				// this.ball.push(new Ball(1000, 500, 20, 100))
				this.ball = (new Ball(1000, 500, 20, 100))
				this.sec = -1
			}
		}
		this.check_intersection()
		this.bot()
		if (this.bricks.length < 1 && Math.floor(Math.random() * 1000) == 0)
			this.bricks.push(new Brick())
		// if (this.ball.length)
		if (this.ball)
		{
			// if (this.ball[0].out.left || this.ball[0].out.right)
			if (this.ball.out.left || this.ball.out.right)
			{
				// this.score.p1 += Number(this.ball[0].out.right);
				// this.score.p1 += Number(this.ball[0].out.right);
				this.score.p2 += Number(this.ball.out.left);
				this.score.p2 += Number(this.ball.out.left);
				// this.ball.pop()
				// this.ball.pop()
				this.time = new Date()
			}
			else
				this.ball.update()
		}
	}

}

export class Circle
{
    position: Position
    r: number
    scale: number
    constructor(x: number, y: number, r: number)
    {
        this.position = {x:x,y:y};
        this.r = r;
        this.scale = 1;
    }
    change_scale(scale: number)
    {
        this.rest_scale()
        this.scale = scale;
        this.r *= this.scale;
    }
    rest_scale()
    {
        this.r /= this.scale;
        this.scale = 1;
    }
    change_position(x: number, y: number)
    {
        this.position = {x:x,y:y};
    }
    intersect(c : Circle) : boolean
    {
        const dis = (this.position.x - c.position.x)**2 + (this.position.y - c.position.y)**2
        return (dis < ((c.r + this.r))**2)
    }
}

export class Ball extends Circle
{
    dx: number
    dy: number
    speed: number
    time: Date
    out: {left:boolean , right:boolean}
    constructor(h: number, w: number, r: number, arc: number)
    {
        const ang = Math.PI/ 6 + 2*(Math.PI * Math.random())/3;
        const dir = Math.floor(Math.random() * 2) * 2 - 1;
        const x = h/2 + arc * Math.sin(ang) * dir
        const y = w/2 + arc * Math.cos(ang)
        // const x = 800;
        // const y = 250
        super(x, y, r);
        this.speed = 2
        this.dx = Math.sin(ang) * dir * this.speed
        this.dy = Math.cos(ang) * this.speed
        this.time = new Date
        this.out = {left:false,right:false}
    } 
    set_velocity(vx: number, vy: number)
    {
        this.dx = this.speed * vx/((vx**2 + vy**2)**(1/2)) 
        this.dy = this.speed * vy /((vx**2 + vy**2)**(1/2))
    }
    set_velocity_angle(dr: number, ang: number)
    {
        ang = ang + ((Math.random() - .5) * Math.PI)/6
        this.dx = this.speed * dr * Math.cos(ang) + 0.01;
        this.dy = this.speed * dr * Math.sin(ang) + 0.01;
    }
    getSpeed():number
    {
        return (this.dx*this.dx + this.dy*this.dy)**(1/2)
    }
    setSpeed(speed: number)
    {
        this.speed = speed
    }
    update()
    {
        
        this.position.x = this.position.x + this.dx
        this.position.y = this.position.y + this.dy
        this.out.left = (this.position.x < 0)
        this.out.right = (this.position.x > 1000)
        if (this.position.y + this.r>= 600)
            this.dy = -1 * Math.abs(this.dy)
        if (this.position.y - this.r<= 0)
            this.dy = Math.abs(this.dy)
    }
    get_data(h: number, w: number, color: number): PSize
    {
        const scale = h/w;
        let data: PSize = {height: this.r  *1000/h,
                        width:this.r *  1000/h,
                        color: "",
                        position: {x: (this.position.x) * 1000 /h,
                                    y: (this.position.y)  * 1000 /h},
                        scale: this.scale,
                        rotation: 0
                        
                    }
        // let data: PSize = {height: this.r /2 *100/h,
        //                 width:this.r * 100 / h,
        //                 color: color,
        //                 position: {x: (this.position.x) * 100 /h,
        //                             y: (this.position.y) * 100 /h},
        //                 scale: this.scale,
        //                 rotation: 0

        //             }
        return data;
    }
}

class Rectangle
{
    position: Position
    height: number
    width: number
    rotation: number
    scale: number
    constructor(x: number, y: number, h: number, w:number)
    {
        this.position = {x:x,y:y};
        this.width = w
        this.height = h
        this.scale = 1
        this.rotation = 0
    }
    change_scale(scale: number)
    {
        
        this.scale = scale;
        this.width = this.width * this.scale;
        this.height = this.height * this.scale;
    }
    rest_scale()
    {
        this.width /= this.scale;
        this.height /= this.scale;
        this.scale = 1;
    }
    change_rotation(ang: number)
    {
        this.rotation = ang
    }
    line_circle_intersection(line: { x1: number; y1: number; x2: number; y2: number }, c: Circle): boolean
    {
        const { x1, y1, x2, y2 } = line;

        const a = (x2 - x1) ** 2 + (y2 - y1) ** 2;
        const b =
            2 * (x1 - c.position.x) * (x2 - x1) + 2 * (y1 - c.position.y) * (y2 - y1);
        const cc = (x1 - c.position.x) ** 2 + (y1 - c.position.y) ** 2 - (c.r) ** 2;

        const discriminant = b ** 2 - 4 * a * cc;
        if (discriminant < 0)
            return false;
        const t1 = (-b + Math.sqrt(discriminant)) / (2 * a);
        const t2 = (-b - Math.sqrt(discriminant)) / (2 * a);
        if (t1 >= -1 && t1 <= 1)
            return true;
        if (t2 >= -1 && t2 <= 1)
            return true;
        return false;
    }

    intersect(c : Circle, sig: number): boolean
    {
        
        const height = this.height - this.width
        const line1 = {
            x1 : this.position.x - this.width/2 * sig,
            y1 : this.position.y,
            x2 : this.position.x + Math.sin(-this.rotation) * height/2 - sig * this.width/2,
            y2 : this.position.y + Math.cos(-this.rotation) * height/2,
        }
        // const line2 = {
        //     x1 : this.position.x + this.width/2,
        //     y1 : this.position.y,
        //     x2 : this.position.x + Math.sin(-this.rotation) * height/2 + this.width/2,
        //     y2 : this.position.y + Math.cos(-this.rotation) * height/2,
        // }
        return (this.line_circle_intersection(line1, c))
    }
    
}

export class Paddle extends Rectangle
{
    side1: Circle
    side2: Circle
    time: Date
    constructor(x: number, y: number, h: number, w:number)
    {
        super(x, y, h, w)
        this.side1 = new Circle(x, y + h/2 -w/2, w/2)
        this.side2 = new Circle(x , y - h/2 + w/2 , w/2)
        this.time = new Date
    }
    rotate(ang: number)
    {
        let c =  (this.height - this.width)/2 * Math.cos(-ang)
        let s = (this.height - this.width)/2 * Math.sin(-ang)
        this.change_rotation(ang);
        this.side1.change_position(this.position.x + s, this.position.y + c)
        this.side2.change_position(this.position.x - s, this.position.y - c)
    }
    changeScale(scale: number) 
    {
        this.time = new Date()
        this.restScale()
        this.change_scale(scale)
        this.side1.change_scale(scale)
        this.side2.change_scale(scale)
        let c = (this.height - this.width)/2 * Math.cos(-this.rotation)
        let s = (this.height - this.width)/2 * Math.sin(-this.rotation)
        this.side1.change_position(this.position.x + s, this.position.y + c)
        this.side2.change_position(this.position.x - s, this.position.y - c)
    }
    restScale() 
    {
        this.rest_scale()
        this.side1.rest_scale()
        this.side2.rest_scale()
        let c = (this.height - this.width)/2 * Math.cos(-this.rotation)
        let s = (this.height - this.width)/2 * Math.sin(-this.rotation)
        this.side1.change_position(this.position.x + s, this.position.y + c)
        this.side2.change_position(this.position.x - s, this.position.y - c)
    }

    check_intersection(ball: Ball, sig: number): number
    {
        const now = new Date()
        if (this.scale != 1 && now.getTime() - this.time.getTime() > 7000)
            this.restScale()
        if (this.intersect(ball, sig))
            ball.set_velocity_angle(-sig, this.rotation)
        else if (this.side1.intersect(ball))
            ball.set_velocity(ball.position.x - this.side1.position.x , ball.position.y - this.side1.position.y)
        else if (this.side2.intersect(ball))
            ball.set_velocity(ball.position.x - this.side2.position.x , ball.position.y - this.side2.position.y)
        return 0;
    }
    move_left(speed: number, limit : number)
    {
        if (this.position.y - this.height/2 >= limit)
        {
            this.position.y = this.position.y - speed
            this.side1.position.y = this.side1.position.y - speed
            this.side2.position.y = this.side2.position.y - speed
        }
    }
    move_right(speed: number, limit : number)
    {
        if (this.position.y + this.height/2<= limit)
        {
            this.position.y = this.position.y + speed
            this.side1.position.y = this.side1.position.y + speed
            this.side2.position.y = this.side2.position.y + speed
        }
    }
    get_data(h: number, w: number, color: number): PSize
    {

        const scale = h/w; 
        // const data: PSize = {height: this.height * 0.1*scale ,
        //                         width:this.width * 0.1,
        //                         color: "color",
        //                         position: {x: (this.position.x - this.width/(2 )) * 100 / h,
        //                                     y: (this.position.y - this.height/(2)) *scale * 100 / h},
        //                         scale: this.scale,
        //                         rotation: this.rotation
        //                     }
        const data: PSize = {height: this.height ,
                                width:this.width,
                                color: "color",
                                position: {x: (this.position.x ),
                                            y: (this.position.y)},
                                scale: this.scale,
                                rotation: this.rotation
                            }
        // const data: PSize = {height: this.side2.r * 2 * 0.1* scale ,
        //                             width:this.side2.r * 2 * 0.1,
        //                             color: 0,
        //                             position: {x: (this.side2.position.x - this.side2.r * 2/(2 )) * 100 / h,
        //                                         y: (this.side2.position.y - this.side2.r * 2/(2)) *scale * 100 / h},
        //                             scale: this.scale,
        //                             rotation: this.rotation
        //                         }
        return data;
    }
}

export class Brick extends Rectangle
{
    creation_time: Date
    type: number
    color: Array<string>
    constructor()
    {
        const x = 450 + Math.random() *100
        const y = 200 + Math.random() *200
        super(x, y, 70,70);
        this.creation_time = new Date()
        this.type = Math.floor(Math.random() * 6);
        this.color = new Array( "#f00000", "#00f000" , "#00f000", "#f000f0", "#f0f000", "#00f0f0");
        


    }
    get_data(h: number, w: number, color: number): PSize
    {
        // const scale = h/w;
        // const data: PSize = {height: this.height * 0.1*scale ,
        //                     width:this.width * 0.1,
        //                 color:  this.color,
        //                 position: {x: (this.position.x - this.width/2) * 100 / h,
        //                             y: (this.position.y - this.height/2) *scale * 100 / h},
        //                 scale: this.scale,
        //                 rotation: this.rotation
        //             }
        const data: PSize = {height: this.height ,
            width:this.width,
            color: this.color[this.type],
            position: {x: (this.position.x ),
                        y: (this.position.y)},
            scale: this.scale,
            rotation: this.rotation
        }
        
        return data;
    }
    check_intersect(c: Circle): number {
        const line1 = {
            x1 : this.position.x + this.width/2,
            y1 : this.position.y,
            x2 : this.position.x + this.width/2,
            y2 : this.position.y + this.height/2,
        }
        const line2 = {
            x1 : this.position.x - this.width/2,
            y1 : this.position.y,
            x2 : this.position.x - this.width/2,
            y2 : this.position.y + this.height/2,
        }
        const line3 = {
            x1 : this.position.x,
            y1 : this.position.y + this.height/2,
            x2 : this.position.x + this.width/2,
            y2 : this.position.y + this.height/2,
        }
        const line4 = {
            x1 : this.position.x,
            y1 : this.position.y - this.height/2,
            x2 : this.position.x + this.width/2,
            y2 : this.position.y - this.height/2,
        }
        if (this.line_circle_intersection(line1, c) ||
            this.line_circle_intersection(line4, c) ||
            this.line_circle_intersection(line2, c) ||
            this.line_circle_intersection(line3, c))
                return this.type + 1;
        return 0;
    }
}