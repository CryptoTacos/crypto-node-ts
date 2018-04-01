"use strict";

import { Request, Response } from "express";
import * as Gdax from "gdax";

const publicClient = new Gdax.PublicClient();

export let index = (req: Request, res: Response) => {
    res.sendStatus(200);
};

/**
 * Fetch a list of available currency pairs for trading
 * @param req
 * @param res
 */
export let getProducts = async (req: Request, res: Response) => {
    try {
        res.jsonp(await publicClient.getProducts());
    } catch (error) {
        res.jsonp(error);
    }
};

/**
 * Get a list of open orders for multiple products. The amount of detail shown can be customized with the level
 * parameter
 * @param req
 * @param res
 */
export let getProductOrderBook = async (req: Request, res: Response) => {
    const tsym: string = req.params.tsym ? req.params.tsym : "USD";
    const level: number = req.params.level ? req.params.level : 3;
    try {
        res.jsonp(await publicClient.getProductOrderBook(`${req.params.fsym}-${tsym}`, { level: level }));
    } catch (error) {
        res.jsonp(error);
    }
};

/**
 * Get a list of open orders for multiple products. The amount of detail shown can be customized with the level
 * parameter
 * @param req
 * @param res
 */
export let getProductOrderBookMulti = async (req: Request, res: Response) => {
    const productOrderBookResponse: any[] = [];
    const fsyms: string[] = req.query.fsyms.split(",");
    const tsyms: string[] | undefined = req.query.tsyms ? req.query.tsyms.split(",") : undefined;
    const level: number = req.query.level ? req.query.level : 3;
    try {
        if (tsyms) {
            for (const fsym of fsyms) {
                for (const tsym of tsyms) {
                    productOrderBookResponse.push(await publicClient.getProductOrderBook(`${fsym.toUpperCase()}-${tsym.toUpperCase()}`, { level: level }));
                }
            }
        }
        else {
            for (const fsym of fsyms) {
                productOrderBookResponse.push(await publicClient.getProductOrderBook(`${fsym.toUpperCase()}-USD`, { level: level }));
            }
        }
    } catch (error) {
        productOrderBookResponse.push(error);
    }
};

/**
 * Snapshot information about the last trade (tick), best bid/ask and 24h volume
 * @param req
 * @param res
 */
export let getProductTicker = async (req: Request, res: Response) => {
    const tsym: string = req.params.tsym ? req.params.tsym : "USD";
    try {
        res.jsonp(await publicClient.getProductTicker(`${req.params.fsym.toUpperCase()}-${tsym.toUpperCase()}`));
    } catch (error) {
        res.jsonp(error);
    }
};

/**
 * Snapshot information about the last trade (tick) for multiple coins
 * best bid/ask and 24h volume
 * @param req
 * @param res
 */
export let getProductTickerMulti = async (req: Request, res: Response) => {
    const productTickerMultiResponse: any[] = [];
    const fsyms: string[] = req.query.fsyms.split(",");
    const tsyms: string[] | undefined = req.query.tsyms ? req.query.tsyms.split(",") : undefined;
    try {
        for (const fsym of fsyms) {
            if (tsyms) {
                for (const tsym of tsyms) {
                    productTickerMultiResponse.push(await publicClient.getProductTicker(`${fsym.toUpperCase()}-${tsym.toUpperCase()}`));
                }
            } else {
                productTickerMultiResponse.push(await publicClient.getProductTicker(`${fsym.toUpperCase()}-USD`));
            }
        }
    } catch (error) {
        res.jsonp(error);
    }
};

/**
 * List the latest trades for a product
 * @param req
 * @param res
 */
export let getTrades = async (req: Request, res: Response) => {
    const tsym: string = req.params.tsym ? req.params.tsym : "USD";
    try {
        res.jsonp(await publicClient.getProductTrades(`${req.params.fsym.toUpperCase()}-${tsym.toUpperCase()}`));
    } catch (error) {
        res.jsonp(error);
    }
};

/**
 * List the latest trades for multiple products
 * @param req
 * @param res
 */
export let getTradesMulti = async (req: Request, res: Response) => {
    const tradesMultipResponse: any[] = [];
    const fsyms: string[] = req.query.fsyms.split(",");
    const tsyms: string[] | undefined = req.query.tsyms ? req.query.tsyms.split(",") : undefined;
    try {
        for (const fsym of fsyms) {
            if (tsyms) {
                for (const tsym of tsyms) {
                    tradesMultipResponse.push(await publicClient.getProductTrades(`${fsym.toUpperCase()}-${tsym.toUpperCase()}`));
                }
            } else {
                tradesMultipResponse.push(await publicClient.getProductTrades(`${fsym.toUpperCase()}-USD`));
            }
        }
    } catch (error) {
        res.jsonp(error);
    }
};

/**
 * Historic rates for a product. Rates are returned in grouped buckets based on
 * granularity
 * @param req
 * @param res
 */
export let getHistoricRates = async (req: Request, res: Response) => {
    const tsym: string = req.params.tsym ? req.params.tsym : "USD";
    try {
        res.jsonp(await publicClient.getProductHistoricRates(`${req.params.fsym.toUpperCase()}-${tsym.toUpperCase()}`, { granulatiry: 60 }));
    } catch (error) {
        res.jsonp(error);
    }
};

/**
 * Historic rates for multiple products. Rates are returned in grouped buckets based on
 * granularity
 * @param req
 * @param res
 */
export let getHistoricRatesMulti = async (req: Request, res: Response) => {
    const historicTradesMultiResponse: any[] = [];
    const fsyms: string[] = req.query.fsyms.split(",");
    const tsyms: string[] | undefined = req.query.tsyms ? req.query.tsyms.split(",") : undefined;
    const granularity: number = req.params.granularity;

    try {
        for (const fsym of fsyms) {
            if (tsyms) {
                for (const tsym of tsyms) {
                    historicTradesMultiResponse.push(await publicClient.getProductHistoricRates(`${fsym.toUpperCase()}-${tsym.toUpperCase()}`, { granularity: granularity }));
                }
            } else {
                historicTradesMultiResponse.push(await publicClient.getProductHistoricRates(`${fsym.toUpperCase()}-USD`, { granularity: granularity }));
            }
        }
    } catch (error) {
        res.jsonp(error);
    }
};

/**
 * Get 24hr stats for the product. Volume is in base currency units. Open, Low and High are in
 * quote currency units
 * @param req
 * @param res
 */
export let get24hrStats = async (req: Request, res: Response) => {
    const tsym: string = req.params.tsym ? req.params.tsym : "USD";
    try {
        res.jsonp(await publicClient.getProduct24HrStats(`${req.params.fsym.toUpperCase()}-${tsym.toUpperCase()}`));
    } catch (error) {
        res.jsonp(error);
    }
};


/**
 * Get 24hr stats for muultiple products. Volume is in base currency units.
 * Open, Low and High are in quote currency units
 * @param req
 * @param res
 */
export let get24hrStatsMulti = async (req: Request, res: Response) => {
    const dailyStatsMultiResposne: any[] = [];
    const fsyms: string[] = req.query.fsyms.split(",");
    const tsyms: string[] | undefined = req.query.tsyms ? req.query.tsyms.split(",") : undefined;

    try {
        for (const fsym of fsyms) {
            if (tsyms) {
                for (const tsym of tsyms) {
                    dailyStatsMultiResposne.push(await publicClient.getProduct24HrStats(`${fsym.toUpperCase()}-${tsym.toUpperCase()}`));
                }
            } else {
                dailyStatsMultiResposne.push(await publicClient.getProduct24HrStats(`${fsym.toUpperCase()}-USD`));
            }
        }
    } catch (error) {
        res.jsonp(error);
    }
};

/**
 * List known currencies
 * @param req
 * @param res
 */
export let getCurrencies = async (req: Request, res: Response) => {
    try {
        res.jsonp(await publicClient.getCurrencies());
    } catch (error) {
        res.jsonp(error);
    }
};

/**
 * Get the API Server time
 * @param req
 * @param res
 */
export let getTime = async (req: Request, res: Response) => {
    try {
        res.jsonp(await publicClient.getTime());
    } catch (error) {
        res.jsonp(error);
    }
};